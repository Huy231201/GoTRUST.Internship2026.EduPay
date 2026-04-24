namespace EduPayAPI.Application.Features.Classes.BulkCreate;
public class BulkCreateClassValidator : AbstractValidator<BulkCreateClassCommand>
{
    public BulkCreateClassValidator()
    {
        RuleFor(x => x.StartLetter)
            .GreaterThanOrEqualTo('A')
            .LessThanOrEqualTo('Z');

        RuleFor(x => x.EndLetter)
            .GreaterThanOrEqualTo('A')
            .LessThanOrEqualTo('Z');

        RuleFor(x => x.StartLetter)
            .LessThanOrEqualTo(x => x.EndLetter);

        RuleFor(x => x.StartNumber)
            .GreaterThanOrEqualTo(1);

        RuleFor(x => x.EndNumber)
            .LessThanOrEqualTo(12);

        RuleFor(x => x.StartNumber)
            .LessThanOrEqualTo(x => x.EndNumber);
    }
}